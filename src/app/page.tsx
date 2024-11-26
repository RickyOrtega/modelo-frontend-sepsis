"use client";

import React, { useState, useEffect } from "react";

export default function FormPage() {
  const [formData, setFormData] = useState({
    age_years: "",
    sex_0male_1female: "0", // Valor predeterminado: Hombre
    episode_number: "",
  });

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("bg-gradient-to-br from-purple-400 to-blue-300");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (result) {
      const match = result.match(/[\d.]+$/); // Encuentra el número al final de la cadena
      let score = match ? parseFloat(match[0]) * 100 : 0; // Convierte de 0-1 a 0-100
  
      // Limita el valor máximo al 100%
      score = Math.min(score, 100);
  
      // Ajusta el color del fondo
      if (score <= 70) {
        setBackgroundColor("bg-gradient-to-br from-red-600 to-red-400");
        setMessage(`¡Ten cuidado! Cuídate mucho porque tienes un ${score.toFixed(1)}% de posibilidades de no contarla 😢`);
        setIcon("😢");
      } else if (score > 70 && score <= 90) {
        setBackgroundColor("bg-gradient-to-br from-yellow-400 to-orange-400");
        setMessage(`¡Cuidado moderado! Tienes un ${score.toFixed(1)}% de posibilidades de sobrevivir, pero todavía puedes mejorar 💪`);
        setIcon("💪");
      } else {
        setBackgroundColor("bg-gradient-to-br from-green-400 to-green-500");
        setMessage(`¡Todo bien! Tienes un ${score.toFixed(1)}% de posibilidades de que no te pase nada 😄`);
        setIcon("😄");
      }
    }
  }, [result]);  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Inputs: {
            input1: [
              {
                age_years: parseInt(formData.age_years),
                sex_0male_1female: parseInt(formData.sex_0male_1female),
                episode_number: parseInt(formData.episode_number),
              },
            ],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const scoredLabel = data.Results.WebServiceOutput0[0]["Scored Labels"];
      setResult(`Scored Label: ${scoredLabel}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={`min-h-screen flex items-center justify-center ${backgroundColor} transition-all duration-700`}>
  <div className="flex flex-row items-center space-x-12">
    <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition duration-300">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Formulario de Predicción de sobrevivencia a una Sepsis
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="age_years"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Edad (años)
            </label>
            <input
              type="number"
              name="age_years"
              id="age_years"
              value={formData.age_years}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="sex_0male_1female"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Sexo
            </label>
            <select
              id="sex_0male_1female"
              name="sex_0male_1female"
              value={formData.sex_0male_1female}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="0">Hombre</option>
              <option value="1">Mujer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="episode_number"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Número de Episodio
            </label>
            <input
              type="number"
              name="episode_number"
              id="episode_number"
              value={formData.episode_number}
              onChange={handleChange}
              className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          >
            {loading ? "Procesando..." : "Enviar"}
          </button>
        </form>
        
      </div>
      {result && (
      <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center w-96 transition-transform duration-500 transform translate-x-0">
      <p className="text-6xl mb-4">{icon}</p>
      <p className="text-lg font-medium text-gray-800 text-center">{message}</p>
      </div>
    )}
    </div>
    </div>
  );
}
