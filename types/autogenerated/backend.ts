/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TireTypeResponseDto {
  id: number;
  title: string;
  description: string | null;
  status: "draft" | "published" | "deleted";
  imageUrl: string | null;
  videoUrl: string | null;
  optimalPressure: number | null;
  radius: number | null;
  likesCount: number;
  isLiked: 0 | 1;
  isOwner: 0 | 1;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  formedAt: string | null;
}

export interface PublishTireTypeDto {
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string;
  /**
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /**
   * @min 0.5
   * @max 9.9
   */
  optimalPressure: number;
  /**
   * @min 13
   * @max 22
   */
  radius: number;
}

export interface LikeTireTypeDto {
  like: 0 | 1;
}

export interface LikeResponseDto {
  likesCount: number;
  isLiked: 0 | 1;
}

export interface RegisterUserDto {
  /**
   * @minLength 3
   * @maxLength 50
   * @pattern ^[A-Za-z0-9_.-]+$
   */
  login: string;
  /**
   * @minLength 6
   * @maxLength 72
   */
  password: string;
}

export interface UserResponseDto {
  id: number;
  login: string;
}

export interface LoginUserDto {
  login: string;
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Tire Pressure API
 * @version 1.0
 * @contact
 *
 * Чтение (список и лента услуг) доступно без авторизации. Методы создателя требуют сессию: выполните POST /api/users/login, браузер сохранит куку sessionId и будет отправлять её сам.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Публичный метод. Возвращает опубликованные услуги, фильтр по радиусу. С кукой дополнительно заполняет isLiked и isOwner.
     *
     * @tags tire_types
     * @name TireTypesControllerGetAllTireTypes
     * @summary Список услуг с фильтром
     * @request GET:/api/tire_types
     */
    tireTypesControllerGetAllTireTypes: (
      query?: {
        /**
         * @min 13
         * @max 22
         */
        radiusMin?: number;
        /**
         * @min 13
         * @max 22
         */
        radiusMax?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TireTypeResponseDto[], any>({
        path: `/api/tire_types`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Только для авторизованного создателя. Автор (creatorId) подставляется из сессии. У пользователя может быть один черновик.
     *
     * @tags tire_types
     * @name TireTypesControllerCreateTireType
     * @summary Создание услуги-черновика
     * @request POST:/api/tire_types
     * @secure
     */
    tireTypesControllerCreateTireType: (
      data: {
        /**
         * @maxLength 100
         * @example "Летние шины R17"
         */
        title: string;
        /**
         * jpeg, png, webp или gif, до 5 МБ
         * @format binary
         */
        image: File;
        /**
         * mp4, mov или webm, до 50 МБ
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<TireTypeResponseDto, void>({
        path: `/api/tire_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Публичный метод. Без `id` возвращает первую опубликованную услугу. С `id` возвращает эту услугу, а при `next=true` следующую за ней, после последней — первую.
     *
     * @tags tire_types
     * @name TireTypesControllerGetFeedItem1
     * @summary Лента услуг
     * @request GET:/api/tire_types/feed/{id}
     */
    tireTypesControllerGetFeedItem1: (
      id?: number,
      query?: {
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<TireTypeResponseDto, void>({
        path: `/api/tire_types/feed/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Только для авторизованного создателя.
     *
     * @tags tire_types
     * @name TireTypesControllerGetDraft
     * @summary Черновик текущего пользователя
     * @request GET:/api/tire_types/draft
     * @secure
     */
    tireTypesControllerGetDraft: (params: RequestParams = {}) =>
      this.request<TireTypeResponseDto, void>({
        path: `/api/tire_types/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Только для создателя услуги: заполняет описание, давление и радиус и переводит черновик в published.
     *
     * @tags tire_types
     * @name TireTypesControllerPublishTireType
     * @summary Публикация услуги
     * @request PUT:/api/tire_types/{id}/publish
     * @secure
     */
    tireTypesControllerPublishTireType: (
      id: number,
      data: PublishTireTypeDto,
      params: RequestParams = {},
    ) =>
      this.request<TireTypeResponseDto, void>({
        path: `/api/tire_types/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Только для создателя услуги. Услуга помечается как deleted.
     *
     * @tags tire_types
     * @name TireTypesControllerDeleteTireType
     * @summary Удаление услуги
     * @request DELETE:/api/tire_types/{id}
     * @secure
     */
    tireTypesControllerDeleteTireType: (
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/tire_types/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Только для авторизованного пользователя. like=1 ставит, like=0 снимает.
     *
     * @tags tire_types
     * @name TireTypesControllerSetLike
     * @summary Поставить или снять лайк
     * @request POST:/api/tire_types/{id}/like
     * @secure
     */
    tireTypesControllerSetLike: (
      id: number,
      data: LikeTireTypeDto,
      params: RequestParams = {},
    ) =>
      this.request<LikeResponseDto, void>({
        path: `/api/tire_types/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт пользователя. Логин уникален, пароль хранится в виде scrypt-хеша.
     *
     * @tags users
     * @name UsersControllerRegister
     * @summary Регистрация
     * @request POST:/api/users/register
     */
    usersControllerRegister: (
      data: RegisterUserDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, any>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль, создаёт сессию в Redis и выдаёт HttpOnly-куку `sessionId`.
     *
     * @tags users
     * @name UsersControllerLogin
     * @summary Аутентификация
     * @request POST:/api/users/login
     */
    usersControllerLogin: (data: LoginUserDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и очищает куку. Повторный вызов безопасен.
     *
     * @tags users
     * @name UsersControllerLogout
     * @summary Деавторизация
     * @request POST:/api/users/logout
     * @secure
     */
    usersControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
