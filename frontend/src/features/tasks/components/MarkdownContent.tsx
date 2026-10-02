import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <Box
      className="task-markdown"
      sx={{
        '& p': { m: 0, mb: 1, '&:last-child': { mb: 0 } },
        '& ul, & ol': { m: 0, pl: 2.5, mb: 1 },
        '& code': {
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.85em',
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          bgcolor: 'action.hover',
        },
        '& pre': {
          overflow: 'auto',
          p: 1.5,
          borderRadius: 1,
          bgcolor: 'action.hover',
          mb: 1,
        },
        '& pre code': { bgcolor: 'transparent', p: 0 },
        '& a': { color: 'primary.main' },
        fontSize: 14,
        lineHeight: 1.55,
        color: 'text.primary',
        wordBreak: 'break-word',
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Box>
  );
}
