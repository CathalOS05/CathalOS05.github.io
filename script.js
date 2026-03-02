// Optional accordion: opening one project closes the others
document.querySelectorAll('details.card').forEach((d) => {
  d.addEventListener('toggle', () => {
    if (d.open) {
      document.querySelectorAll('details.card').forEach((other) => {
        if (other !== d) other.open = false;
      });
    }
  });
});