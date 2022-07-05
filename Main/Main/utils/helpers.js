module.exports = {
    format_date: (date) => {
      const x = date.toLocaleDateString();
      const y = date.toLocaleTimeString();
      return (x + " "+ y)
    }
  };