package com.uzair.aiticketing.common.mapper;

import java.util.List;

public interface BaseMapper<E, R> {

    R toResponse(E entity);

    List<R> toResponseList(List<E> entities);

}