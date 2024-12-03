package com.obigo.v2x.constants;

import lombok.Getter;

@Getter
public enum ObjectType {

    AI_ONE(1, "1인용"),
    AI_TWO(2, "2인용");

    private Integer code;
    private String name;


    ObjectType(Integer code, String name) {
        this.code = code;
        this.name = name;
    }

}

