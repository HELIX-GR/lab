package helix.lab.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.opensaml.saml2.core.Attribute;
import org.opensaml.xml.schema.impl.XSAnyImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;

import gr.helix.core.common.model.EnumRole;
import gr.helix.core.common.model.user.Account;
import helix.lab.model.security.User;

@Service
public class SAMLUserDetailsServiceImpl implements SAMLUserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(SAMLUserDetailsServiceImpl.class);

    private final static String ATTRIBUTE_USERNAME ="uid";
    private final static String ATTRIBUTE_MAIL ="mail";
    private final static String ATTRIBUTE_NAME ="name";
    private final static String ATTRIBUTE_FAMILY_NAME ="familyName";
    private final static String ATTRIBUTE_GIVEN_NAME ="givenName";

    @Override
    public Object loadUserBySAML(SAMLCredential credential) throws UsernameNotFoundException {
        final String userID = credential.getNameID().getValue();

        // https://ldap.com/ldap-oid-reference-guide/

        final Map<String, String> attributes = new HashMap<String, String>();
        credential.getAttributes().stream()
            .forEach(attr -> {
                switch (attr.getFriendlyName()) {
                    case "uid":
                        // urn:oid:0.9.2342.19200300.100.1.1
                        attributes.put(ATTRIBUTE_USERNAME, this.getValue(attr));
                        break;
                    case "mail":
                        // urn:oid:0.9.2342.19200300.100.1.3
                        attributes.put(ATTRIBUTE_MAIL, this.getValue(attr));
                        break;
                    case "displayName":
                        // urn:oid:2.16.840.1.113730.3.1.241
                        attributes.put(ATTRIBUTE_NAME, this.getValue(attr));
                        break;
                    case "sn":
                        // urn:oid:2.5.4.4
                        attributes.put(ATTRIBUTE_FAMILY_NAME, this.getValue(attr));
                        break;
                    case "givenName":
                        // urn:oid:2.5.4.42
                        attributes.put(ATTRIBUTE_GIVEN_NAME, this.getValue(attr));
                        break;
                }
            });

        if (StringUtils.isBlank(ATTRIBUTE_USERNAME)) {
            logger.error("Cannot map SAML credential attributes to user");
            throw new UsernameNotFoundException(userID);
        }

        // TODO: Load user data from database and assign roles

        final Account account = new Account(attributes.get(ATTRIBUTE_USERNAME));
        account.setEmail(attributes.get(ATTRIBUTE_MAIL));
        account.setName(attributes.get(ATTRIBUTE_NAME));
        account.setFamilyName(attributes.get(ATTRIBUTE_FAMILY_NAME));
        account.setGivenName(attributes.get(ATTRIBUTE_GIVEN_NAME));

        account.getRoles().add(EnumRole.ROLE_USER);

        return new User(account, "");
    }

    private String getValue(Attribute attr) {
        return ((XSAnyImpl) attr.getAttributeValues().get(0)).getTextContent();
    }
}
