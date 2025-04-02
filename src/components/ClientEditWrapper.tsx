'use client';

import EditButton from './EditButton';

export default function ClientEditWrapper({
  ownerId,
  url,
}: {
  ownerId: string;
  url: string;
}) {
  return <EditButton ownerId={ownerId} url={url} />;
}
