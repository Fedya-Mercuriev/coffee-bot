// import NavigationMenuItem from 'menus';

export default function normalizeButtonProperties(button: {
  [key: string]: any;
}): NavigationMenuItem {
  const result: NavigationMenuItem = {
    name: '',
    data: {}
  };

  for (let key in button) {
    if (key === 'name') {
      result.name = button[key];
    } else {
      result.data[key] = button[key];
    }
  }

  return result;
}
