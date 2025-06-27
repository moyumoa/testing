import * as Icons from '@/icons';

const Icon = ({ name, size = 16, style = {}, ...rest }) => {
  const SvgIcon = Icons[name];

  if (!SvgIcon) {
    console.warn(`[Icon] 未找到图标: ${name}`);
    return null;
  }

  return (
    <SvgIcon
      width={size}
      height={size}
      // ✅ 不设置 fill，确保 SVG 内部写的是 fill="currentColor"
      style={{
        verticalAlign: 'middle',
        display: 'inline-block',
        color: 'inherit', // ✅ 继承父级 color（让菜单控制颜色）
        ...style,
      }}
      {...rest}
    />
  );
};

export default Icon;
