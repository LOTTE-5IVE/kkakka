package kkakka.mainservice.elasticsearch.acceptance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.restdocs.restassured3.RestAssuredRestDocumentation.document;

import io.restassured.RestAssured;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import kkakka.mainservice.DocumentConfiguration;
import kkakka.mainservice.elasticsearch.application.dto.ProductDocumentDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class ProductDocumentAcceptanceTest extends DocumentConfiguration {

    @DisplayName("검색 조회 - 성공")
    @Test
    void showProductsBySearch_success() {
        //given
        //when
        ExtractableResponse<Response> response = RestAssured
            .given(spec).log().all()
            .filter(document("show-products-search-success"))
            .when()
            .get("/api/es/search?keyword=웨하스")
            .then()
            .log().all().extract();

        //then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.body().jsonPath().getList("data", ProductDocumentDto.class)).hasSize(2);
        assertThat(response.body().jsonPath().getList("data",ProductDocumentDto.class).stream()
                            .map(productDocumentDto -> productDocumentDto.getName().contains("웨하스"))
                            .findAny())
            .isNotEmpty();
    }

}
