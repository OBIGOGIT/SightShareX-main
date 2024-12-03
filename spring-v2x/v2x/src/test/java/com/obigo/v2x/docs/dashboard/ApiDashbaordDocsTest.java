package com.obigo.v2x.docs.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.obigo.v2x.docs.config.RestDocsConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.requestHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.requestParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Import(RestDocsConfiguration.class)   // 정렬 부분!
//@AutoConfigureRestDocs(uriHost = "http", uriPort = 8090)
@AutoConfigureRestDocs(uriScheme = "https", uriHost = "v2x.obigo.com", uriPort = 443)
class ApiDashbaordDocsTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @DisplayName("차량 데이터 조회")
    @Test
    void sharinfo() throws Exception {
        mockMvc.perform(
                        RestDocumentationRequestBuilders.get("/api/v1/sharinfo")
                                .header("api-key", "5754c82fe5ff126b9f7f4fc94b3e57d4b6de78093766d95eae6d9fb769c2b6e14fe4510383f33e1c6852f2a27516e10f")
                                .param("page", "0")
                                .param("size", "10")
                                .param("startDate", "2024-01-01")
                                .param("endDate", "2024-12-31")
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("select-sharinfo",
                        requestHeaders(
                                headerWithName("api-key").description("API 인증 키")
                        ),
                        requestParameters(
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 사이즈"),
                                parameterWithName("startDate").description("조회 시작 날짜 (yyyy-MM-dd)").optional(),
                                parameterWithName("endDate").description("조회 종료 날짜 (yyyy-MM-dd)").optional()
                        ),
                        responseFields(
                                fieldWithPath("result").description("결과 메시지"),
                                fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터"),
                                fieldWithPath("data[].logSharInfoSeq").description("로그 공유 정보 일련번호"),
                                fieldWithPath("data[].latitude").description("위도"),
                                fieldWithPath("data[].longitude").description("경도"),
                                fieldWithPath("data[].heading").description("방향"),
                                fieldWithPath("data[].velocity").description("속도"),
                                fieldWithPath("data[].type").description("타입"),
                                fieldWithPath("data[].carType").description("차량 타입"),
                                fieldWithPath("data[].created").description("생성 날짜"),
                                fieldWithPath("contentSize").description("응답 데이터의 크기"),
                                fieldWithPath("totalPages").description("전체 페이지 수"),
                                fieldWithPath("totalElements").description("전체 요소 수")
                        )
                ));


    }


    @DisplayName("위험 장애물 정보 조회")
    @Test
    void obsctacleList() throws Exception {
        mockMvc.perform(
                        RestDocumentationRequestBuilders.get("/api/v1/obsctacle")
                                .header("api-key", "5754c82fe5ff126b9f7f4fc94b3e57d4b6de78093766d95eae6d9fb769c2b6e14fe4510383f33e1c6852f2a27516e10f")
                                .param("size", "10")
                                .param("page", "412")
                                .param("sort", "logDangerousObstacleSeq,Desc")
                                .param("startDate", "2024-01-10")
                                .param("endDate", "2024-11-10")
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("select-obsctacle",
                        requestHeaders(
                                headerWithName("api-key").description("API 인증 키")
                        ),
                        requestParameters(
                                parameterWithName("size").description("페이지 크기"),
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("sort").description("정렬 기준"),
                                parameterWithName("startDate").description("조회 시작 날짜 (yyyy-MM-dd)").optional(),
                                parameterWithName("endDate").description("조회 종료 날짜 (yyyy-MM-dd)").optional()
                        ),
                        responseFields(
                                fieldWithPath("result").description("결과 메시지"),
                                fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터"),
                                fieldWithPath("data[].logDangerousObstacleSeq").description("위험 장애물 일련번호"),
                                fieldWithPath("data[].emergencyType").description("긴급 유형"),
                                fieldWithPath("data[].latitude").description("위도"),
                                fieldWithPath("data[].longitude").description("경도"),
                                fieldWithPath("data[].carType").description("차량 타입"),
                                fieldWithPath("data[].created").description("생성 날짜"),
                                fieldWithPath("contentSize").description("응답 데이터의 크기"),
                                fieldWithPath("totalPages").description("전체 페이지 수"),
                                fieldWithPath("totalElements").description("전체 요소 수")
                        )
                ));
    }



}
