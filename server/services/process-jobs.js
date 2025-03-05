export default function processJobs(jobs) {
  const objectResult = jobs.map((job) => ({
    id: job.id,
    title: job.name,
    company: job.company?.name || 'Unknown company',
    location: job.locations.map((loc) => loc.name).join(', '),
    level: job.levels.map((level) => level.name).join(', '),
    category: job.categories.map((cat) => cat.name).join(', '),
    description: job.contents || 'No description available',
    date_posted: job.publication_date,
    url: job.refs?.landing_page || job.refs?.apply_link,
  }));

  return objectResult;
}
