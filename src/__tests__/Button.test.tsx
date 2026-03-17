import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('fires onClick handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>No</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies intent variant classes', () => {
    const { container } = render(<Button intent="danger">Del</Button>);
    expect(container.firstChild).toHaveClass('bg-danger-500');
  });

  it('applies size variant classes', () => {
    const { container } = render(<Button size="lg">Big</Button>);
    expect(container.firstChild).toHaveClass('h-11');
  });

  it('merges custom className', () => {
    const { container } = render(<Button className="my-extra">X</Button>);
    expect(container.firstChild).toHaveClass('my-extra');
  });

  it('passes HTML attributes through', () => {
    render(<Button type="submit" data-testid="btn">Submit</Button>);
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveAttribute('type', 'submit');
  });
});
