import { useCallback, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

export interface VideoSummaryResponse {
  message: string;
  title: string;
  txt_file: string;
  summary: string;
  video_id: string;
}

export interface VideoSummaryHistoryItem {
  title: string;
  transcribeText: string;
  thumbnail: string;
  summaryText: string;
  videoLink: string;
}

interface ApiErrorResponse {
  message?: string;
}

interface VideoSummaryHistoryEnvelope {
  data: unknown;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

const isVideoSummaryResponse = (
  value: unknown,
): value is VideoSummaryResponse => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.message === "string" &&
    typeof value.title === "string" &&
    typeof value.txt_file === "string" &&
    typeof value.summary === "string" &&
    typeof value.video_id === "string"
  );
};

const isVideoSummaryHistoryItem = (
  value: unknown,
): value is VideoSummaryHistoryItem => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.title === "string" &&
    typeof value.transcribeText === "string" &&
    typeof value.thumbnail === "string" &&
    typeof value.summaryText === "string" &&
    typeof value.videoLink === "string"
  );
};

const getApiErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    if (body.message) {
      return body.message;
    }
  } catch {
    // The API may return an empty or non-JSON error response.
  }

  return `Request failed with status ${response.status}`;
};

const parseJsonResponse = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    throw new ApiError("The video summary service returned invalid JSON");
  }
};

class VideoSummaryApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, "");
  }

  private async request(
    endpoint: string,
    options: RequestInit,
  ): Promise<unknown> {
    let response: Response;

    try {
      response = await fetch(`${this.baseURL}${endpoint}`, options);
    } catch (error) {
      throw new ApiError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the video summary service",
      );
    }

    if (!response.ok) {
      throw new ApiError(
        await getApiErrorMessage(response),
        response.status,
      );
    }

    return parseJsonResponse(response);
  }

  async generateSummary(videoUrl: string): Promise<VideoSummaryResponse> {
    const data = await this.request("/youtube/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ videoUrl }),
    });

    if (!isVideoSummaryResponse(data)) {
      throw new ApiError("The video summary service returned an invalid response");
    }

    return data;
  }

  async getSummaries(): Promise<VideoSummaryHistoryItem[]> {
    const data = await this.request("/youtube/summaries", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    let records: unknown;

    if (Array.isArray(data)) {
      records = data;
    } else if (isVideoSummaryHistoryItem(data)) {
      records = [data];
    } else if (isObject(data) && "data" in data) {
      records = (data as unknown as VideoSummaryHistoryEnvelope).data;
    }

    if (
      !Array.isArray(records) ||
      !records.every(isVideoSummaryHistoryItem)
    ) {
      throw new ApiError("The video history service returned an invalid response");
    }

    return records;
  }
}

export const videoSummaryApi = new VideoSummaryApiService(API_BASE_URL);

export function useVideoSummaryApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VideoSummaryResponse | null>(null);

  const generateSummary = useCallback(async (videoUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await videoSummaryApi.generateSummary(videoUrl);
      setData(result);
      return result;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate summary",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    data,
    generateSummary,
    reset,
  };
}

export function useVideoSummariesApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VideoSummaryHistoryItem[] | null>(null);

  const loadSummaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await videoSummaryApi.getSummaries();
      setData(result);
      return result;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load video history",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    loadSummaries,
  };
}
