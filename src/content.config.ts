import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const chainsCollection = defineCollection({
  loader: glob({ pattern: '**/_meta.json', base: './data' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    nameZh: z.string().optional(),
    icon: z.string().optional(),
    description: z.string().optional(),
    descriptionZh: z.string().optional(),
    website: z.string().url().optional(),
    active: z.boolean().default(true),
    sortOrder: z.number().default(999),
    chainId: z.string().optional(),
    upgradeId: z.string().optional(),
    date: z.string().optional(),
    blockNumber: z.string().optional(),
    epochNumber: z.string().optional(),
    type: z.union([
      z.array(z.string()).default([]),
      z.string().default(''),
    ]).optional(),
    summary: z.string().optional(),
    summaryZh: z.string().optional(),
    number: z.number().optional(),
    impact: z.enum(['high', 'medium', 'low']).default('medium'),
    category: z.string().optional(),
    major: z.boolean().default(false),
  }),
});

export const collections = {
  chains: chainsCollection,
};
