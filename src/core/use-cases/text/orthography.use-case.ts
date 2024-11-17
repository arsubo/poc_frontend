import type { OrthographyResponse } from "../../../interfaces";

export const orthographyUseCase = async (prompt: string) => {
  try {
    const resps = await fetch(
      `${import.meta.env.VITE_GPT_API}/orthography-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resps.ok) {
      throw new Error("No se pudo realizar la corrección");
    }

    const data = (await resps.json()) as OrthographyResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: "No se pudo realizar la corrección",
    };
  }
};
