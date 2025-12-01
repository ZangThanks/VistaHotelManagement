package com.hotelvista.security.oauth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import java.util.HashMap;
import java.util.Map;

public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;

    public CustomAuthorizationRequestResolver(
            ClientRegistrationRepository repo,
            String authorizationRequestBaseUri) {
        this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(
                repo,
                authorizationRequestBaseUri
        );
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
        return customize(req);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientId) {
        OAuth2AuthorizationRequest req = defaultResolver.resolve(request, clientId);
        return customize(req);
    }

    private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest req) {
        if (req == null) return null;

        Map<String, Object> params = new HashMap<>(req.getAdditionalParameters());
        params.put("prompt", "select_account");

        return OAuth2AuthorizationRequest
                .from(req)
                .additionalParameters(params)
                .build();
    }
}
