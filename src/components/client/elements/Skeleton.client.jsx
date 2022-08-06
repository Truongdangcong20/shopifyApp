import clsx from 'clsx';

export function Skeleton({
  as: Component = 'div',
  width,
  height,
  className,
  ...props
}) {
  const styles = clsx('rounded bg-primary/10', className);

  return (
    <Component {...props} width={width} height={height} className={styles} />
  );
}
