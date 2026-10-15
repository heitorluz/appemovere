import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

// Proves the mobile runner is wired (FR-004). The app has no screen yet (FR-002).
it('renders a React Native component', async () => {
  await render(<Text>runner wired</Text>);

  expect(screen.getByText('runner wired')).toBeOnTheScreen();
});
