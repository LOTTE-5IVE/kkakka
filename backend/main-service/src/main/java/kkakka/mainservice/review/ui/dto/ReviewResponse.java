package kkakka.mainservice.review.ui.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.time.LocalDateTime;
import kkakka.mainservice.common.LocalDateTimeSerializer;
import kkakka.mainservice.review.application.dto.ReviewDto;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReviewResponse {

    private Long id;
    private String contents;
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;
    private MemberSimpleResponse memberResponse;

    public static ReviewResponse create(ReviewDto reviewDto,
            MemberSimpleResponse memberSimpleResponse) {
        return new ReviewResponse(reviewDto.getId(),
                reviewDto.getContents(),
                reviewDto.getCreatedAt(),
                memberSimpleResponse);
    }
}