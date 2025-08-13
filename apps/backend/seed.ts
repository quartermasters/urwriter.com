import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create a sample user first
    const user = await prisma.user.create({
      data: {
        email: 'client@example.com',
        passwordHash: '$2a$10$K8gKrRJIjJzJzJzJzJzJzJzJzJzJzJzJzJzJzJzJzJzJzJzJzJzJz', // fake hash
        roleFlags: 1, // client
        status: 'active',
      },
    });

    // Create sample jobs
    const jobs = await Promise.all([
      prisma.job.create({
        data: {
          clientId: user.id,
          title: 'Professional Blog Post Writing',
          description: 'Need a skilled writer to create engaging blog posts about technology trends. Must have experience in tech writing and SEO optimization.',
          scope: {
            deliverables: ['2000-word blog post', 'SEO optimization', 'Meta descriptions'],
            timeline: '1 week',
            requirements: ['Native English', 'Tech writing experience', 'SEO knowledge']
          },
          skills: ['Content Writing', 'SEO', 'Technology', 'Blog Writing'],
          budgetType: 'fixed',
          budgetMin: 150,
          budgetMax: 300,
          visibility: 'public',
          status: 'published',
        },
      }),
      prisma.job.create({
        data: {
          clientId: user.id,
          title: 'Marketing Copy for Product Launch',
          description: 'Create compelling marketing copy for our new SaaS product launch. Need someone who understands conversion copywriting.',
          scope: {
            deliverables: ['Landing page copy', 'Email sequences', 'Ad copy'],
            timeline: '2 weeks',
            requirements: ['Marketing experience', 'SaaS knowledge', 'Conversion optimization']
          },
          skills: ['Marketing Copy', 'SaaS', 'Conversion Writing', 'Email Marketing'],
          budgetType: 'fixed',
          budgetMin: 500,
          budgetMax: 1000,
          visibility: 'public',
          status: 'published',
        },
      }),
      prisma.job.create({
        data: {
          clientId: user.id,
          title: 'Technical Documentation Writer',
          description: 'Looking for an experienced technical writer to create comprehensive API documentation for our developer platform.',
          scope: {
            deliverables: ['API documentation', 'Code examples', 'Getting started guide'],
            timeline: '3 weeks',
            requirements: ['Technical writing', 'API documentation', 'Developer experience']
          },
          skills: ['Technical Writing', 'API Documentation', 'Developer Tools', 'Code Examples'],
          budgetType: 'hourly',
          budgetMin: 50,
          budgetMax: 80,
          visibility: 'public',
          status: 'published',
        },
      }),
    ]);

    console.log('Seed data created successfully!');
    console.log(`Created user: ${user.email}`);
    console.log(`Created ${jobs.length} jobs`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
