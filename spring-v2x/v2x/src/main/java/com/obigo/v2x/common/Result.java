package com.obigo.v2x.common;

import lombok.Getter;

@Getter
public enum Result {

	SUCCESS("success")
	,FAIL("fail");

	private String value;

	Result(String value) {
		this.value = value;
	}

}
