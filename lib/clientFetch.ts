
export class ClientFetch {
  static getPublicOptions(method: string, data?: any, form?: HTMLFormElement | null) {
    if (data && form) {
        const body = new FormData(form)
        // Object.entries(data).forEach(([key, value]) => {
        //     body.append(key, String(value))
        // })
        return {
            method,
            body,
          };
    }
    return {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data && JSON.stringify(data),
    };
  }
  static getPrivateOptions<T>(method: string, body?: T) {
    return {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    };
  }
  static async publicGet<R>(url: string, options: any = {}) {
    const response = await fetch(url, {
      ...this.getPublicOptions("GET"),
      ...options,
    }).then((r) => r.json());
    return response as R;
  }
  static async publicPost<R, T>(url: string, body?: T, options: any = {}) {
    const response = await fetch(url, {
      ...this.getPublicOptions("POST", body),
      ...options,
    }).then((r) => r.json());
    return response as R;
  }
  static async publicPostForm<R, T>(url: string, form: HTMLFormElement | null, data?: T, options: any = {}) {
    const response = await fetch(url, {
      ...this.getPublicOptions("POST", data, form),
      ...options,
    }).then((r) => r.json());
    return response as R;
  }
}
// @ts-ignore
export const fetcher = (...args) => fetch(...args).then(res => res.json())
