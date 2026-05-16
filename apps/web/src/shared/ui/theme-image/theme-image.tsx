import Image, { type ImageProps } from "next/image";

type ThemeImageProps = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

export function ThemeImage({ srcLight, srcDark, ...rest }: ThemeImageProps) {
  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
}
