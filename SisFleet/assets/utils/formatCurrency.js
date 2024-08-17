export const formatCurrency = (value) => {
    // Remove tudo que não é número, ponto ou vírgula
    const cleanedValue = value.replace(/[^0-9,]/g, '');
  
    // Se já há uma vírgula, impedi de adicionar outra
    const hasComma = cleanedValue.includes(',');
  
    // Remove pontos, deixa apenas a última vírgula (se houver)
    const normalizedValue = hasComma
      ? cleanedValue.replace(/\./g, '')
      : cleanedValue.replace(/,/g, '.');
  
    // Formata para duas casas decimais
    const numberValue = parseFloat(normalizedValue);
  
    // Retorna o valor formatado com duas casas decimais, mas não durante a digitação
    return isNaN(numberValue) ? cleanedValue : numberValue.toFixed(2).replace('.', ',');
  };
  