/**
 * AEM Assets Wrapper
 *
 * Wraps the dropin's AEM Assets functions to handle SKUs containing forward slashes.
 * SKUs like "apple-iphone-se/iphone-se" break AEM Assets URLs because the slash
 * creates an invalid path segment. This wrapper sanitizes the alias (SKU) before
 * passing it to the dropin.
 *
 * Usage: Import from this file instead of '@dropins/tools/lib/aem/assets.js'
 */

import {
  tryRenderAemAssetsImage as originalTryRenderAemAssetsImage,
  generateAemAssetsOptimizedUrl as originalGenerateAemAssetsOptimizedUrl,
  tryGenerateAemAssetsOptimizedUrl as originalTryGenerateAemAssetsOptimizedUrl,
  makeAemAssetsImageSlot as originalMakeAemAssetsImageSlot,
} from '@dropins/tools/lib/aem/assets.js';

// Re-export functions that don't need wrapping
export {
  getDefaultAemAssetsOptimizationParams,
  isAemAssetsEnabled,
  isAemAssetsUrl,
} from '@dropins/tools/lib/aem/assets.js';

/**
 * Sanitizes a SKU for use in AEM Assets URLs.
 * Replaces forward slashes with dashes to prevent invalid URL paths.
 *
 * @param {string} sku - The product SKU
 * @returns {string} - Sanitized SKU safe for URL paths
 */
export function sanitizeSkuForAssets(sku) {
  return sku?.replace(/\//g, '-') || '';
}

/**
 * Wrapper for tryRenderAemAssetsImage that sanitizes the alias (SKU).
 * Drop-in replacement - just change your import path.
 *
 * @param {Object} ctx - The context object from the dropin slot
 * @param {Object} options - Options including alias, imageProps, params, wrapper
 */
export function tryRenderAemAssetsImage(ctx, options) {
  const sanitizedOptions = {
    ...options,
    alias: sanitizeSkuForAssets(options.alias),
  };
  return originalTryRenderAemAssetsImage(ctx, sanitizedOptions);
}

/**
 * Wrapper for generateAemAssetsOptimizedUrl that sanitizes the alias (SKU).
 *
 * @param {string} baseUrl - The base AEM Assets URL
 * @param {string} alias - The product SKU/alias
 * @param {Object} params - Optional optimization parameters
 */
export function generateAemAssetsOptimizedUrl(baseUrl, alias, params = {}) {
  return originalGenerateAemAssetsOptimizedUrl(baseUrl, sanitizeSkuForAssets(alias), params);
}

/**
 * Wrapper for tryGenerateAemAssetsOptimizedUrl that sanitizes the alias (SKU).
 *
 * @param {string} url - The image URL
 * @param {string} alias - The product SKU/alias
 * @param {Object} params - Optional optimization parameters
 */
export function tryGenerateAemAssetsOptimizedUrl(url, alias, params = {}) {
  return originalTryGenerateAemAssetsOptimizedUrl(url, sanitizeSkuForAssets(alias), params);
}

/**
 * Wrapper for makeAemAssetsImageSlot that sanitizes the alias (SKU).
 *
 * @param {Object} options - Options including alias, imageProps, params, wrapper
 */
export function makeAemAssetsImageSlot(options) {
  const sanitizedOptions = {
    ...options,
    alias: sanitizeSkuForAssets(options.alias),
  };
  return originalMakeAemAssetsImageSlot(sanitizedOptions);
}
