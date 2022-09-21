package kkakka.mainservice.auth.ui.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class TokenDto {

    private String accessToken;

    public static TokenDto create(String accessToken) {
        return new TokenDto(accessToken);
    }
}
