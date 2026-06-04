package com.cepheid.aem.dotcom.core.servlets;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.BufferedReader;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.Resource;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

@Component(immediate = true, service = Servlet.class,
    property = {
            ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
            ServletResolverConstants.SLING_SERVLET_PATHS + "=/bin/demo/qikregistration.json"
    })
public class QikRegistrationServlet extends SlingAllMethodsServlet {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response) throws IOException, ServletException {
        doPost(request, response);
    }

    @Override
    protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response) throws IOException, ServletException {
        logger.info("Qik Registration POST BEGIN .....");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        StringBuilder sb = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        String payload = sb.toString();

        if (!StringUtils.isBlank(payload)) {
            ResourceResolver resourceResolver = request.getResourceResolver();
            Resource parentResource = resourceResolver.getResource("/etc/acs-commons/lists/qik-leads/jcr:content/list");

            if (null != parentResource) {
                String title = "";
                String nodeName = "lead_" + UUID.randomUUID().toString();

                try {
                    JsonParser parser = new JsonParser();
                    JsonObject jsonObject = parser.parse(payload).getAsJsonObject();

                    String firstName = jsonObject.has("firstName") ? jsonObject.get("firstName").getAsString() : "";
                    String lastName = jsonObject.has("lastName") ? jsonObject.get("lastName").getAsString() : "";

                    title = (firstName + " " + lastName).trim();

                    if (StringUtils.isBlank(title)) {
                        title = "Anonymous Lead";
                    }

                } catch (JsonSyntaxException e) {
                    logger.error("Error parsing JSON payload", e);
                    response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"status\":\"error\", \"message\":\"Invalid JSON payload\"}");
                    return;
                }

                // Define the node properties
                Map<String, Object> properties = new HashMap<>();
                properties.put("jcr:primaryType", "nt:unstructured");
                properties.put("jcr:title", title);
                properties.put("value", payload);

                try {
                    Resource newResource = resourceResolver.create(parentResource, nodeName, properties);
                    resourceResolver.commit();
                    logger.info("Resource generated: {}", newResource.getPath());

                    response.setStatus(SlingHttpServletResponse.SC_OK);
                    response.getWriter().write("{\"status\":\"success\", \"path\":\"" + newResource.getPath() + "\"}");
                } catch (Exception e) {
                    logger.error("Error saving resource to repository", e);
                    response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write("{\"status\":\"error\", \"message\":\"Could not save registration data\"}");
                }
            } else {
                logger.error("Parent resource path '/etc/acs-commons/lists/qik-leads/jcr:content/list' not found.");
                response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"status\":\"error\", \"message\":\"Target storage path not found\"}");
            }
        } else {
            logger.warn("Payload is empty");
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"status\":\"error\", \"message\":\"Empty payload\"}");
        }
    }
}