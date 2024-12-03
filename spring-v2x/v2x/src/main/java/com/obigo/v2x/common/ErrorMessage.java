package com.obigo.v2x.common;

import lombok.Getter;

@Getter
public enum ErrorMessage {

	SYSTEM_ERROR("시스템 오류가 발생하였습니다."),
    INVALID_PATH("잘못 된 경로로 접근하셨습니다."),
    INVALID_TOKEN("유효하지 않은 토큰입니다."),
    AUTHENTICATION_MEMBER_NOT_EXISTS("아이디 또는 비밀번호를 잘못 입력했습니다"),
    ID_ALREADY_EXISTS("이미 등록되어 있는 아이디입니다"),
    API_ALREADY_EXISTS("이미 등록되어 있는 API입니다"),
    API_NOT_UPDATE("변경을 원하시면 삭제 후 재등록이 필요합니다."),
    API_IN_USE("현재 사용중인 API 입니다."),
    API_NOT_EXISTS("존재 하지않는 API 키입니다."),
    EMAIL_ALREADY_EXISTS("이미 등록되어 있는 이메일 주소 입니다"),
    KEY_ALREADY_EXISTS("이미 등록되어 있는 키입니다"),
    KEY_NOT_FOUND("토큰이 존재하지 않습니다."),

    AGE_REQUIRED("Age 항목은 필수 값 입니다."),
    NAME_REQUIRED("Name 항목은 필수 값 입니다."),
    SEX_REQUIRED("Sex 항목은 필수 값 입니다."),
    PARAM_REQUIRED("필수 항목이 존재 하지 않습니다."),
    FIND_NOT_STUDIO("정류장을 찾을 수 없습니다."),
    FIND_NOT_USER("사용자가 존재 하지 않습니다"),


    TOKEN_NOT_FOUND("토큰이 존재하지 않습니다."),
    ID_ALREADY_USER_KEY_EXISTS("이미 등록되어 있는 UserKey 입니다"),
    ID_UNRECEIVED("미승인 아이디 입니다. 관리자에게 문의하시길 바랍니다."),
    CURRENT_PASSWORD_DO_NOT_MATCH("현재 비밀번호가 일치하지 않습니다."),
    ONLY_YOU_CAN_DELETE_IT("본인것만 삭제가능합니다."),
    BAD_DATA("잘못 된 데이터입니다."),
    WRONG_APPROACH("잘못 된 접근입니다.");

    private String message;

    ErrorMessage(String message) {
        this.message = message;
    }

}
