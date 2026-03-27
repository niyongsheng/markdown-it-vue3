/**
 * Streaming Markdown Renderer
 * Handles append-only rendering for AI conversation-style streaming
 * with block-aware buffering for multi-line constructs
 */

/**
 * Block detection patterns for multi-line constructs
 */
const BLOCK_PATTERNS = {
  fence: {
    // Fenced code blocks: ```mermaid, ```echarts, ```javascript, etc.
    detectStart: (line) => line.match(/^```\S*/),
    detectEnd: (line) => line.match(/^```\s*$/),
    includeEndInBlock: true // The closing ``` is part of the block
  },
  admonition: {
    // Admonition blocks: ::: success, ::: info, ::: warning, ::: error
    detectStart: (line) => line.match(/^:::\s*\w+/),
    detectEnd: (line) => line.match(/^:::\s*$/),
    includeEndInBlock: true // The closing ::: is part of the block
  },
  table: {
    // Markdown tables: | Header | ... |
    detectStart: (line) => line.match(/^\|.*\|/),
    detectEnd: (line) => !line.match(/^\|.*\|/) && line.trim() !== '',
    includeEndInBlock: false, // The ending line is NOT part of the table
    // Filter empty lines within table to improve robustness
    filterContent: (content) => content.split('\n').filter(line => line.trim() !== '').join('\n') + '\n'
  },
  list: {
    // Markdown lists: *, -, +, 1., 2., etc. (including nested)
    detectStart: (line) => line.match(/^\s*([*\-+]|\d+\.)\s/),
    detectEnd: (line) => {
      // Empty line might be part of list, so we need a non-empty, non-list line to end
      if (line.trim() === '') return false
      return !line.match(/^\s*([*\-+]|\d+\.)\s/)
    },
    includeEndInBlock: false,
    // Detect if line continues the list (including empty lines between items)
    isContinuation: (line) => line.trim() === '' || line.match(/^\s*([*\-+]|\d+\.)\s/)
  }
}

/**
 * Creates a streaming renderer instance
 * @param {object} md - markdown-it instance with plugins configured
 * @returns {object} Renderer with append, finalize, and reset methods
 */
export function createStreamingRenderer(md) {
  let renderedContent = ''    // Already rendered HTML
  let buffer = ''             // Incomplete line buffer

  // Block-aware buffering state
  let currentBlockType = null // Current block type being buffered ('fence' | 'admonition' | null)
  let blockBuffer = ''        // Accumulated block content

  /**
   * Check if a line starts a block
   * @returns {string|null} Block type or null
   */
  const detectBlockStart = (line) => {
    for (const [type, pattern] of Object.entries(BLOCK_PATTERNS)) {
      if (pattern.detectStart(line)) {
        return type
      }
    }
    return null
  }

  /**
   * Check if a line ends the current block
   * @returns {boolean}
   */
  const detectBlockEnd = (line, blockType) => {
    const pattern = BLOCK_PATTERNS[blockType]
    return pattern && pattern.detectEnd(line)
  }

  return {
    /**
     * Append a chunk of markdown content
     * @param {string} chunk - New markdown content to append
     * @returns {{html: string, pending: string, isComplete: boolean}}
     */
    append(chunk) {
      buffer += chunk

      // Split into lines and process each
      const lines = buffer.split('\n')

      // Keep the last incomplete line in buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        const lineWithNewline = line + '\n'

        if (currentBlockType) {
          // Check if this line ends the block BEFORE adding it
          if (detectBlockEnd(line, currentBlockType)) {
            const pattern = BLOCK_PATTERNS[currentBlockType]

            if (pattern.includeEndInBlock) {
              // For fence/admonition: ending marker is part of the block
              blockBuffer += lineWithNewline
              // Apply content filter if available (e.g., for tables)
              const contentToRender = pattern.filterContent ? pattern.filterContent(blockBuffer) : blockBuffer
              renderedContent += md.render(contentToRender)
              blockBuffer = ''
              currentBlockType = null
            } else {
              // For tables: ending line is NOT part of the block
              // Apply content filter if available (e.g., for tables)
              const contentToRender = pattern.filterContent ? pattern.filterContent(blockBuffer) : blockBuffer
              renderedContent += md.render(contentToRender)
              blockBuffer = ''
              currentBlockType = null

              // Process the ending line separately
              const newBlockType = detectBlockStart(line)
              if (newBlockType) {
                currentBlockType = newBlockType
                blockBuffer = lineWithNewline
              } else {
                renderedContent += md.render(lineWithNewline)
              }
            }
          } else {
            // We're inside a block, accumulate content
            blockBuffer += lineWithNewline
          }
        } else {
          // Not inside a block, check if starting one
          const newBlockType = detectBlockStart(line)

          if (newBlockType) {
            // Start buffering a new block
            currentBlockType = newBlockType
            blockBuffer = lineWithNewline
          } else {
            // Normal line, render immediately (existing behavior)
            renderedContent += md.render(lineWithNewline)
          }
        }
      }

      return {
        html: renderedContent,
        pending: currentBlockType ? blockBuffer + buffer : buffer,
        isComplete: false
      }
    },

    /**
     * Finalize the stream and render any remaining content
     * @returns {{html: string, pending: string, isComplete: boolean}}
     */
    finalize() {
      // If there's a block being buffered, finalize it
      if (currentBlockType && blockBuffer) {
        // Add remaining buffer to block
        blockBuffer += buffer
        // Apply content filter if available
        const pattern = BLOCK_PATTERNS[currentBlockType]
        const contentToRender = pattern?.filterContent ? pattern.filterContent(blockBuffer) : blockBuffer
        renderedContent += md.render(contentToRender)
        blockBuffer = ''
        currentBlockType = null
      } else if (buffer) {
        // No block, just render remaining buffer
        renderedContent += md.render(buffer)
      }

      buffer = ''

      return {
        html: renderedContent,
        pending: '',
        isComplete: true
      }
    },

    /**
     * Reset the renderer state
     */
    reset() {
      renderedContent = ''
      buffer = ''
      currentBlockType = null
      blockBuffer = ''
    },

    /**
     * Get current state without modification
     * @returns {{html: string, pending: string, isComplete: boolean}}
     */
    getState() {
      return {
        html: renderedContent,
        pending: currentBlockType ? blockBuffer + buffer : buffer,
        isComplete: false
      }
    }
  }
}

export default createStreamingRenderer
