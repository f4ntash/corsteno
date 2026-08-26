"use client";

import { useState, type FormEvent } from "react";
import styles from "./industrial.module.css";

const goals = ["Visualización", "Configuración", "Cotización", "Ventas", "Procesos internos", "No estoy seguro"];

export default function IndustrialLeadForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Formulario conceptual: el envío todavía no está conectado.");
  };

  return (
    <form className={styles.leadForm} id="industrial-form" onSubmit={handleSubmit}>
      <div className={styles.leadFields}>
        <label>Nombre<input name="name" type="text" autoComplete="name" /></label>
        <label>Empresa<input name="company" type="text" autoComplete="organization" /></label>
        <label>Producto<input name="product" type="text" /></label>
        <label>Web<input name="website" type="url" inputMode="url" autoComplete="url" /></label>
      </div>
      <fieldset>
        <legend>¿Qué querés mejorar?</legend>
        <div className={styles.leadGoals}>
          {goals.map((goal) => <label key={goal}><input type="checkbox" name="goals" value={goal} /> {goal}</label>)}
        </div>
      </fieldset>
      <button type="submit">Enviar consulta</button>
      <p className={styles.formStatus} role="status">{message || "Formulario conceptual · Sin envío activo"}</p>
    </form>
  );
}
