package kkakka.mainservice.fixture;

import static java.util.stream.Collectors.toList;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import kkakka.mainservice.auth.application.UserProfile;
import kkakka.mainservice.member.auth.ui.Authority;

public enum TestMember {

    MEMBER_00("0000", "test.member.default", "0000", "member00",
            "default@email.com", "00~00", "000-0000-0000", Authority.MEMBER),
    MEMBER_01("0001", "test.member.01", "0001", "member01",
            "test01@email.com", "20~29", "010-0000-0000", Authority.MEMBER);

    private String code;
    private String accessToken;
    private String providerId;
    private String name;
    private String email;
    private String ageGroup;
    private String phone;
    private Authority authority;
    private UserProfile userProfile;

    TestMember(String code, String accessToken, String providerId, String name, String email,
            String ageGroup, String phone, Authority authority) {
        this.code = code;
        this.accessToken = accessToken;
        this.providerId = providerId;
        this.name = name;
        this.email = email;
        this.ageGroup = ageGroup;
        this.phone = phone;
        this.authority = authority;
        this.userProfile = new TestUserProfile(
                UUID.randomUUID().toString(),
                name,
                email,
                ageGroup,
                phone
        );
    }

    private static final List<TestMember> FIXTURES =
            Arrays.stream(TestMember.values()).collect(toList());

    public static TestMember findByCode(String code) {
        return FIXTURES.stream()
                .filter((member) -> code.equals(member.code))
                .findAny()
                .orElse(MEMBER_00);
    }

    public static boolean findByAccessToken(String accessToken) {
        return FIXTURES.stream()
                .anyMatch((member) -> member.accessToken.equals(accessToken));
    }

    public String getCode() {
        return code;
    }

    public UserProfile getUserProfile() {
        return userProfile;
    }

    public String getAccessToken() {
        return accessToken;
    }
}
