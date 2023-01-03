export function RadioButtons({ label, name, options, value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <div className="radio-btns">
      <p className="radio-btns-label">{label}</p>
      <div
        className="radio-btns-grid"
        style={{
          "--n-options": options.length,
        }}
      >
        {options.map((opt,index) => {
          return (
            <div key={index}>
              <label className="radio-btn">
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
        .radio-btns-label {
          color: #7191a5;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .radio-btns-grid {
          display: grid;
          grid-template-columns: repeat(var(--n-options), 1fr);
          gap: 15px;
        }

        .radio-btn {
          display: block;
          width: 100%;
          cursor: pointer;
          user-select: none;
        }

        .radio-btn input {
          display: none;
        }

        .radio-btn span {
          display: block;
          text-align: center;
          background: var(--gray-light);
          color: white;
          font-weight: 700;
          text-transform: capitalize;
          padding: 12px 15px;
          border-radius: 99px;
          transition: .2s ease;
        }

        .radio-btn:hover span {
          background: #6395B8;
        }

        .radio-btn input:checked ~ span {
          background: var(--gray-dark);
        }
      `}</style>
    </div>
  );
}
