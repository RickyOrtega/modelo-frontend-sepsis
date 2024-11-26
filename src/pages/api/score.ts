import { NextApiRequest, NextApiResponse } from "next";

// Tipos para el cuerpo de la solicitud y la respuesta
interface RequestBody {
  Inputs: {
    input1: Array<{
      age_years: number;
      sex_0male_1female: number;
      episode_number: number;
    }>;
  };
}

interface BackendResponse {
  Results: {
    WebServiceOutput0: Array<{
      age_years: number;
      sex_0male_1female: number;
      episode_number: number;
      "Scored Labels": number;
    }>;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Solo permite solicitudes POST
  if (req.method === "POST") {
    try {
      // Validar que el cuerpo de la solicitud tiene la estructura correcta
      const body = req.body as RequestBody;

      // Realizar la solicitud al servidor remoto
      const response = await fetch(
        "http://83674c7c-9791-49cc-abed-7e6465e39c3e.eastus2.azurecontainer.io/score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer X7AN5o2ri8FhbXWbHdGCGqQsU0BHMV0w", // Token de autorización
          },
          body: JSON.stringify(body), // Pasar el cuerpo de la solicitud al backend
        }
      );

      // Manejar errores del backend
      if (!response.ok) {
        throw new Error(`Error en el backend: ${response.statusText}`);
      }

      // Procesar la respuesta del backend
      const data: BackendResponse = await response.json();

      // Enviar la respuesta al cliente
      res.status(200).json(data);
    } catch (err: unknown) {
      // Manejo de errores con tipos
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Error desconocido." });
      }
    }
  } else {
    // Manejar métodos no permitidos
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
