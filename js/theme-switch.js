// Gather things needed to handle color scheme switch.
const colorSchemeToggle = document.querySelector('#color-scheme-toggle');
const colorSchemeToggleCheckbox = colorSchemeToggle.querySelector(
  '#color-scheme-toggle-checkbox'
);
const moon = colorSchemeToggle.querySelector('#moon');
const sun = colorSchemeToggle.querySelector('#sun');
const root = document.documentElement;

// Toggle the app into the dark mode.
const toggleDark = () => {
  root.classList.add('dark');
  moon.classList.add('hidden');
  sun.classList.remove('hidden');
  localStorage.theme = 'dark';
};

// Toggle the app into the light mode.
const toggleLight = () => {
  root.classList.remove('dark');
  sun.classList.add('hidden');
  moon.classList.remove('hidden');
  localStorage.theme = 'light';
};

// Color scheme change handler.
const handleThemeSwitch = (e) =>
  e.currentTarget.checked ? toggleLight() : toggleDark();

// Toggle color scheme when toggle state changes.
colorSchemeToggleCheckbox.addEventListener('change', handleThemeSwitch);

// Handle theme switcher.
export default function handleThemeSwitcher() {
  // Resolve color scheme based on local storage or user preferences.
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    // Toggle app into dark mode.
    toggleDark();
    // Trigger change event so our color scheme toggle will react.
    colorSchemeToggleCheckbox.dispatchEvent(new Event('change'));
  } else {
    // Toggle app into light mode.
    toggleLight();
  }
}
