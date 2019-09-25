package gr.helix.lab.web.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.tuple.Pair;
import org.opensaml.saml2.metadata.EntityDescriptor;
import org.opensaml.saml2.metadata.OrganizationDisplayName;
import org.opensaml.saml2.metadata.provider.MetadataProviderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.saml.metadata.MetadataManager;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import gr.helix.lab.web.config.SamlConfiguration;

@Controller
@RequestMapping("/saml")
public class SsoController {

    private static final Logger logger = LoggerFactory.getLogger(SsoController.class);

    @Autowired
    private SamlConfiguration   samlConfiguration;

    @Autowired
    private MetadataManager     metadata;

    @RequestMapping(value = "/idp-select", method = RequestMethod.GET)
    public String idpSelection(HttpServletRequest request, Model model) {

        if (this.isAuthenticated()) {
            logger.warn("The current user is already logged.");
            return "redirect:/";
        }

        if (!this.isForwarded(request)) {
            logger.warn("Direct accesses to '/idp-select' route are not allowed");
            return "redirect:/";
        }

        final Set<String>  idpNames = this.metadata.getIDPEntityNames();
        final List<Pair<String, String>> idpEntities = new ArrayList<Pair<String, String>>();

        for (final String idp : idpNames) {
            try {
                final EntityDescriptor ed = this.metadata.getEntityDescriptor(idp);
                if (ed.getOrganization() != null) {
                    for (final OrganizationDisplayName displayName : ed.getOrganization().getDisplayNames()) {
                        if (displayName.getName().getLanguage().equals("el")) {
                            if ((this.samlConfiguration.getProviders() != null) &&
                                (!this.samlConfiguration.getProviders().contains(idp))) {
                                continue;
                            }
                            idpEntities.add(Pair.of(idp,displayName.getName().getLocalString()));
                            logger.info("Configured Identity Provider for SSO: " + idp);
                            break;
                        }
                    }
                }
            } catch (final MetadataProviderException ex) {
                logger.error("Failed to configure Identity Provider for SSO: " + idp, ex);
            }
        }

        idpEntities.sort((p1, p2) -> p1.getRight().compareTo(p2.getRight()));

        model.addAttribute("idpEntities", idpEntities);

        return "saml/idp-select";
    }

    private boolean isAuthenticated() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return ((authentication != null) && !(authentication instanceof AnonymousAuthenticationToken));
    }

    /*
     * Checks if an HTTP request has been forwarded by a servlet.
     */
    private boolean isForwarded(HttpServletRequest request) {
        if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
            return false;
        } else {
            return true;
        }
    }

}