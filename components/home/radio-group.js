export function RadioGroup({ label, name, options, value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div className="radio-group">
      <p className="label">{label}</p>
      <div
        className="options"
        style={{
          "--n-options": options.length,
        }}
      >
        {options.map((opt) => {
          return (
            <div key={opt.id}>
              <label className="opt">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  onChange={handleChange}
                  checked={value === opt.value}
                />
                <span>{opt.label}</span>
              </label>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .label {
          color: #7191a5;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .options {
          display: grid;
          grid-template-columns: repeat(var(--n-options), 1fr);
          gap: 15px;
        }

        .opt {
          display: block;
          width: 100%;
          cursor: pointer;
          user-select: none;
        }

        .opt input {
          display: none;
        }

        .opt span {
          display: block;
          text-align: center;
          background: var(--gray-light);
          color: white;
          font-weight: 700;
          text-transform: capitalize;
          padding: 12px 15px;
          border-radius: 99px;
        }

        .opt input:checked ~ span {
          background: var(--gray-dark);
        }
      `}</style>
    </div>
  );
}
