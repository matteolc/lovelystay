import terminalImage from 'terminal-image';

import type { UserSchema } from '~/db/types';

const getUserAvatarForTerminal = async (user: UserSchema) => {
  if (!user.avatar_url) {
    return '';
  }
  const avatarResponse = await fetch(user.avatar_url);
  const avatarArrayBuffer = await avatarResponse.arrayBuffer();
  return await terminalImage.buffer(Buffer.from(avatarArrayBuffer), {
    width: '50%',
    height: '50%',
    preserveAspectRatio: true,
  });
};

export { getUserAvatarForTerminal };
