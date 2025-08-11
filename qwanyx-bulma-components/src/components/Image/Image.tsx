import React from 'react';
import { cn } from '../../utils/classNames';

type ImageSize = '16x16' | '24x24' | '32x32' | '48x48' | '64x64' | '96x96' | '128x128' | '256x256' | '512x512';
type ImageRatio = 'square' | '1by1' | '5by4' | '4by3' | '3by2' | '5by3' | '16by9' | '2by1' | '3by1' | '4by5' | '3by4' | '2by3' | '3by5' | '9by16' | '1by2' | '1by3';

interface ImageProps extends React.HTMLAttributes<HTMLFigureElement> {
  size?: ImageSize;
  ratio?: ImageRatio;
  rounded?: boolean;
  fullwidth?: boolean;
}

const Image = React.forwardRef<HTMLElement, ImageProps>(({
  size,
  ratio,
  rounded = false,
  fullwidth = false,
  className,
  children,
  ...rest
}, ref) => {
  const imageClasses = cn(
    'image',
    size && `is-${size}`,
    ratio && `is-${ratio}`,
    rounded && 'is-rounded',
    fullwidth && 'is-fullwidth',
    className
  );

  return (
    <figure ref={ref} className={imageClasses} {...rest}>
      {children}
    </figure>
  );
});

Image.displayName = 'Image';

export default Image;