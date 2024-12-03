package com.obigo.v2x.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ApiStatusType {

    REQUEST_API(1l, "승인요청"),
    RECOGNIZE_API(2l, "승인완료"),
    REJECT_API(3l, "승인거절"),
    CANCLE_API(4l, "해지");

    private Long code;
    private String name;


//    ApiStatusType(Integer code, String name) {
//        this.code = code;
//        this.name = name;
//    }

}
