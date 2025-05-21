/**
 * Formatage de date pour l'affichage dans l'application
 */

/**
 * Formate une date ISO en format lisible
 * @param {string} isoDateString - Date au format ISO (ex: "2025-05-21T20:28:32")
 * @returns {Object} Objet contenant différents formats de date et heure
 */
export const formatDate = (isoDateString) => {
  if (!isoDateString) return { date: "N/A", heure: "N/A", complet: "N/A" };

  const date = new Date(isoDateString);

  // Options pour le format de date
  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };

  // Formatage en français
  const jour = date.toLocaleDateString("fr-FR", dateOptions);
  const heure = date.toLocaleTimeString("fr-FR", timeOptions);

  return {
    date: jour,
    heure: heure,
    complet: `${jour} à ${heure}`,
  };
};
