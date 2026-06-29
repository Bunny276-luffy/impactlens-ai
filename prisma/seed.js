const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing database...');
  await prisma.notification.deleteMany({});
  await prisma.aIReport.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.educationRecord.deleteMany({});
  await prisma.healthRecord.deleteMany({});
  await prisma.donation.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.child.deleteMany({});
  await prisma.volunteer.deleteMany({});
  await prisma.donor.deleteMany({});
  await prisma.nGO.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users...');
  const bcrypt = require('bcryptjs');
  const adminHash = bcrypt.hashSync('Admin@123', 10);
  const ngoHash = bcrypt.hashSync('Ngo@123', 10);
  const donorHash = bcrypt.hashSync('Donor@123', 10);
  const volunteerHash = bcrypt.hashSync('Volunteer@123', 10);

  const userAdmin = await prisma.user.create({
    data: {
      id: 'user_admin',
      email: 'admin@impactlens.ai',
      passwordHash: adminHash,
      name: 'Super Admin',
      role: 'ADMIN'
    }
  });

  const userNgo = await prisma.user.create({
    data: {
      id: 'user_ngo',
      email: 'ngo@impactlens.ai',
      passwordHash: ngoHash,
      name: 'Care & Share Education',
      role: 'NGO'
    }
  });

  const userDonor = await prisma.user.create({
    data: {
      id: 'user_donor',
      email: 'donor@impactlens.ai',
      passwordHash: donorHash,
      name: 'Arjun Malhotra',
      role: 'DONOR'
    }
  });

  const userVolunteer = await prisma.user.create({
    data: {
      id: 'user_volunteer',
      email: 'volunteer@impactlens.ai',
      passwordHash: volunteerHash,
      name: 'Sarah Jenkins',
      role: 'VOLUNTEER'
    }
  });

  console.log('Seeding NGOs...');
  const ngo1 = await prisma.nGO.create({
    data: {
      id: 'ngo_1',
      name: 'Care & Share Education',
      mission: 'Providing quality education and basic amenities to street children.',
      contactEmail: 'ngo@impactlens.ai',
      contactPhone: '+91 98765 43210',
      address: '12, Ring Road, Lajpat Nagar, Delhi, India',
      userId: userNgo.id
    }
  });

  const ngo2 = await prisma.nGO.create({
    data: {
      id: 'ngo_2',
      name: 'Nutrition First',
      mission: 'Eradicating malnutrition in rural communities through structured food programs.',
      contactEmail: 'nutrition@impactlens.ai',
      contactPhone: '+91 99999 88888',
      address: 'Flat 302, Green Glen Layout, Mumbai, India'
    }
  });

  const ngo3 = await prisma.nGO.create({
    data: {
      id: 'ngo_3',
      name: 'Global Hope Foundation',
      mission: 'Holistic child development focusing on literacy and medical aid.',
      contactEmail: 'globalhope@impactlens.ai',
      contactPhone: '+91 88888 77777',
      address: 'Koramangala 4th Block, Bangalore, India'
    }
  });

  console.log('Seeding Donors...');
  const donor1 = await prisma.donor.create({
    data: {
      id: 'donor_1',
      name: 'Arjun Malhotra',
      userId: userDonor.id,
      totalDonated: 15250
    }
  });

  console.log('Seeding Volunteers...');
  const volunteer1 = await prisma.volunteer.create({
    data: {
      id: 'volunteer_1',
      name: 'Sarah Jenkins',
      contactEmail: 'volunteer@impactlens.ai',
      userId: userVolunteer.id,
      status: 'Active'
    }
  });

  console.log('Seeding Children...');
  const child1 = await prisma.child.create({
    data: {
      id: 'child_1',
      name: 'Rahul Kumar',
      age: 8,
      gender: 'Male',
      school: 'Central Primary School',
      guardianName: 'Sunita Devi',
      guardianPhone: '+91 91234 56789',
      guardianRelationship: 'Mother',
      ngoId: ngo1.id
    }
  });

  const child2 = await prisma.child.create({
    data: {
      id: 'child_2',
      name: 'Priya Sharma',
      age: 10,
      gender: 'Female',
      school: 'Girls Secondary School',
      guardianName: 'Ramesh Sharma',
      guardianPhone: '+91 92345 67890',
      guardianRelationship: 'Father',
      ngoId: ngo1.id
    }
  });

  const child3 = await prisma.child.create({
    data: {
      id: 'child_3',
      name: 'Vikram Singh',
      age: 7,
      gender: 'Male',
      school: 'Nursery Primary School',
      guardianName: 'Karan Singh',
      guardianPhone: '+91 93456 78901',
      guardianRelationship: 'Father',
      ngoId: ngo2.id
    }
  });

  console.log('Seeding Health Records...');
  await prisma.healthRecord.create({
    data: {
      id: 'hr_1',
      childId: child1.id,
      height: 122,
      weight: 23,
      bmi: 15.45,
      nutritionScore: 78,
      healthReport: 'Steady growth. No active symptoms.',
      riskAlerts: null,
      recordedById: volunteer1.id
    }
  });

  await prisma.healthRecord.create({
    data: {
      id: 'hr_2',
      childId: child2.id,
      height: 135,
      weight: 28,
      bmi: 15.36,
      nutritionScore: 82,
      healthReport: 'Normal. Active participation.',
      riskAlerts: null,
      recordedById: volunteer1.id
    }
  });

  await prisma.healthRecord.create({
    data: {
      id: 'hr_3',
      childId: child3.id,
      height: 110,
      weight: 15,
      bmi: 12.4,
      nutritionScore: 42,
      healthReport: 'Underweight warnings. Showing signs of mild lethargy.',
      riskAlerts: 'High Malnutrition Risk Alert',
      recordedById: volunteer1.id
    }
  });

  console.log('Seeding Education Records...');
  await prisma.educationRecord.create({
    data: {
      id: 'er_1',
      childId: child1.id,
      learningProgress: 'Good progress in maths.',
      attendanceRate: 92.5,
      learningDifficultyPrediction: null,
      talentIdentification: 'Mathematics'
    }
  });

  await prisma.educationRecord.create({
    data: {
      id: 'er_2',
      childId: child2.id,
      learningProgress: 'Excelling in Arts and Literature.',
      attendanceRate: 96.0,
      learningDifficultyPrediction: null,
      talentIdentification: 'Drawing'
    }
  });

  await prisma.educationRecord.create({
    data: {
      id: 'er_3',
      childId: child3.id,
      learningProgress: 'Slow learner. Poor attendance.',
      attendanceRate: 64.0,
      learningDifficultyPrediction: 'High Dropout Risk due to attendance.',
      talentIdentification: null
    }
  });

  console.log('Seeding Attendance Records...');
  const dates = [new Date(), new Date(Date.now() - 86400000), new Date(Date.now() - 172800000)];
  for (const date of dates) {
    await prisma.attendance.create({
      data: { childId: child1.id, date, status: 'PRESENT' }
    });
    await prisma.attendance.create({
      data: { childId: child2.id, date, status: 'PRESENT' }
    });
    await prisma.attendance.create({
      data: { childId: child3.id, date, status: date.getDate() % 2 === 0 ? 'PRESENT' : 'ABSENT' }
    });
  }

  console.log('Seeding Donations...');
  await prisma.donation.create({
    data: {
      id: 'don_1',
      amount: 500,
      usage: 'Food',
      donorId: donor1.id,
      ngoId: ngo1.id,
      childId: child1.id
    }
  });

  await prisma.donation.create({
    data: {
      id: 'don_2',
      amount: 1250,
      usage: 'Education',
      donorId: donor1.id,
      ngoId: ngo1.id,
      childId: child2.id
    }
  });

  await prisma.donation.create({
    data: {
      id: 'don_3',
      amount: 13500,
      usage: 'General',
      donorId: donor1.id,
      ngoId: ngo1.id
    }
  });

  console.log('Seeding AI Reports...');
  await prisma.aIReport.create({
    data: {
      id: 'ai_1',
      childId: child1.id,
      riskScore: 12,
      dropoutPrediction: 'LOW',
      malnutritionPrediction: 'LOW',
      learningDifficultyPrediction: 'LOW',
      talentIdentification: 'Mathematics',
      suggestedIntervention: 'Continue routine mentorship and school monitoring.',
      priorityRanking: 5,
      aiSummary: 'Steady learning progression and healthy BMI metrics.'
    }
  });

  await prisma.aIReport.create({
    data: {
      id: 'ai_2',
      childId: child2.id,
      riskScore: 8,
      dropoutPrediction: 'LOW',
      malnutritionPrediction: 'LOW',
      learningDifficultyPrediction: 'LOW',
      talentIdentification: 'Drawing',
      suggestedIntervention: 'Support advanced drawing classes. Maintain current diet.',
      priorityRanking: 5,
      aiSummary: 'High potential in arts. Healthy growth check.'
    }
  });

  await prisma.aIReport.create({
    data: {
      id: 'ai_3',
      childId: child3.id,
      riskScore: 82,
      dropoutPrediction: 'HIGH',
      malnutritionPrediction: 'HIGH',
      learningDifficultyPrediction: 'HIGH',
      suggestedIntervention: 'Provide immediate clinical nutrition packs (RUTF) and family counseling on school attendance.',
      priorityRanking: 1,
      aiSummary: 'Biometrics and attendance indices show severe warning conditions.'
    }
  });

  console.log('Seeding Notifications...');
  await prisma.notification.create({
    data: {
      id: 'notif_1',
      userId: userNgo.id,
      type: 'RISK_ALERT',
      title: 'High Malnutrition Risk Alert',
      message: 'Vikram Singh (Age 7) requires immediate nutritional intervention.',
      status: 'UNREAD'
    }
  });

  await prisma.notification.create({
    data: {
      id: 'notif_2',
      userId: userDonor.id,
      type: 'DONATION_CONFIRMATION',
      title: 'Donation Received',
      message: 'Your $1250 donation for Priya Sharma was processed successfully.',
      status: 'UNREAD'
    }
  });

  console.log('Seeding Tasks...');
  await prisma.task.create({
    data: {
      id: 'task_1',
      title: 'Weekly Height & Weight Measurement',
      description: 'Log height and weight of all children at Care & Share center to calculate nutritional scoring.',
      status: 'COMPLETED',
      dueDate: '2026-07-02',
      ngoId: ngo1.id,
      volunteerId: volunteer1.id
    }
  });

  await prisma.task.create({
    data: {
      id: 'task_2',
      title: 'Distribute Monthly Nutrition Kits',
      description: 'Distribute peanut paste, eggs, milk and vitamins to flagged underweight children.',
      status: 'COMPLETED',
      dueDate: '2026-06-26',
      ngoId: ngo1.id,
      volunteerId: volunteer1.id
    }
  });

  await prisma.task.create({
    data: {
      id: 'task_3',
      title: 'Conduct Dropout Counseling Session',
      description: "Visit Amit Patel's home and speak with mother Sita Patel regarding child's high absence rate.",
      status: 'PENDING',
      dueDate: '2026-07-05',
      ngoId: ngo1.id,
      volunteerId: volunteer1.id
    }
  });

  await prisma.task.create({
    data: {
      id: 'task_4',
      title: 'Distribute Textbook & Stationery Sets',
      description: 'Provide study guides and writing notebooks for the new academic semester.',
      status: 'PENDING',
      dueDate: '2026-07-10',
      ngoId: ngo1.id,
      volunteerId: volunteer1.id
    }
  });

  console.log('Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
