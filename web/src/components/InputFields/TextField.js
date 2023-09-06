import passwordSvg from "assets/images/input-password.svg";
import emailSvg from "assets/images/input-email.svg";
let IconComponent = {
  passwordSvg,
  emailSvg,
};

export default function TextField({
  formik,
  type = "text",
  name,
  placeholder,
  showIcon,
  icon,
  label,
}) {
  return (
    <div className="position-relative">
      <div className="mb-3">
        {label ? (
          <label htmlFor={name} className="form-label">
            {label}
          </label>
        ) : (
          ""
        )}
        {showIcon ? (
          <i className="inputIcon">
            <img src={IconComponent[icon]} alt={name} />
          </i>
        ) : (
          ""
        )}
        <input
          type={type}
          className="form-control"
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={type == "password" ? undefined : formik.values[name]}
          name={name}
        />
        {formik.touched[name] && formik.errors[name] ? (
          <div className="error">{formik.errors[name]}</div>
        ) : null}
      </div>
    </div>
  );
}
