export function Cake({ lit = true, size = 'hero' }) {
  return (
    <div
      className={`cake cake--${size} ${lit ? 'is-lit' : 'is-out'}`}
      aria-hidden="true"
    >
      <span className="cake__halo" />
      <div className="cake__candles">
        {[0, 1, 2].map((candle) => (
          <span
            className="cake__candle"
            key={candle}
            style={{ '--candle-index': candle }}
          >
            <span className="cake__flame" />
            <span className="cake__smoke" />
            <span className="cake__wax" />
          </span>
        ))}
      </div>
      <div className="cake__tier cake__tier--top">
        <span className="cake__frosting" />
        <span className="cake__sprinkles" />
      </div>
      <div className="cake__tier cake__tier--middle">
        <span className="cake__frosting" />
        <span className="cake__sprinkles" />
      </div>
      <div className="cake__tier cake__tier--bottom">
        <span className="cake__frosting" />
        <span className="cake__sprinkles" />
      </div>
      <span className="cake__plate" />
      <span className="cake__heart">♥</span>
    </div>
  );
}
