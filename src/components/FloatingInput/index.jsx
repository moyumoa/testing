import React from "react";
import styles from "./index.module.scss";

function FloatingInput({
  id,
  label,
  type = "text",
  name,
  placeholder = " ",
  value,
  onChange,
  required = false,
  size = "default",
}) {
  return (
    <div className={`${styles.floating_label} ${styles[size]}`}>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default FloatingInput;
