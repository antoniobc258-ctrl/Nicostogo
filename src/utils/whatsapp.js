export function abrirWhatsAppTexto(numero, texto) {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}