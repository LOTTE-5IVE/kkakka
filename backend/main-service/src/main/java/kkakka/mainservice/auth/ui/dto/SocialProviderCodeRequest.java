package kkakka.mainservice.auth.ui.dto;

import kkakka.mainservice.auth.application.dto.SocialProviderCodeDto;
import kkakka.mainservice.auth.domain.ProviderName;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SocialProviderCodeRequest {

    private String code;
    private ProviderName providerName;

    public SocialProviderCodeDto toDto() {
        return SocialProviderCodeDto.create(code, providerName);
    }

    public static SocialProviderCodeRequest create(String code, ProviderName providerName) {
        return new SocialProviderCodeRequest(code, providerName);
    }
}
