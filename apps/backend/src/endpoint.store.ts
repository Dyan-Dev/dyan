// File: apps/backend/src/endpoint/endpoint.store.ts

export interface Endpoint {
  path: string;
  method: string;
  language: 'javascript' | 'python';
  code: string;
}

export class EndpointStore {
  private static endpoints: Endpoint[] = [];

  static add(endpoint: Endpoint) {
    this.endpoints.push(endpoint);
  }

  static find(path: string, method: string): Endpoint | undefined {
    return this.endpoints.find(
      (ep) => ep.path === path && ep.method === method
    );
  }

  static all(): Endpoint[] {
    return this.endpoints;
  }

  static clear() {
    this.endpoints = [];
  }
}
