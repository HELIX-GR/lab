package gr.helix.lab.web.model;

public enum EnumAuthProvider {
    Forms,
    Google,
    GitHub,
    HELIX,
    SAML,
    ;

    public static EnumAuthProvider fromString(String value) {
        for (final EnumAuthProvider item : EnumAuthProvider.values()) {
            if (item.name().equalsIgnoreCase(value)) {
                return item;
            }
        }
        return null;
    }

}