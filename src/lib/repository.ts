import { getPrisma } from './db';

// Accessing the prisma instance directly
const prismaInstance = getPrisma();
if (!prismaInstance) {
  // If prismaInstance is null during early imports, we use a proxy
}

const prismaProxy = new Proxy({}, {
  get(target, prop) {
    const client = getPrisma();
    if (!client) throw new Error("Prisma Client is not configured. Please set DATABASE_URL.");
    return (client as any)[prop];
  }
}) as any;

const prisma = prismaProxy;

// Helper to generate AI predictions for a child based on health/edu parameters
export function calculateAIPredictions(child: any, health: any, edu: any) {
  const attendance = edu?.attendanceRate ?? 90;
  const bmi = (health?.weight && health?.height) 
    ? (health.weight / Math.pow(health.height / 100, 2)) 
    : 15;
  const nutritionScore = health?.nutritionScore ?? 75;
  
  let riskScore = 20;
  let dropoutPrediction = 'LOW';
  let malnutritionPrediction = 'LOW';
  let learningDifficultyPrediction = 'LOW';
  let suggestedIntervention = 'Provide general education support and standard mid-day meals.';
  let priorityRanking = 5;
  let aiSummary = 'Child is showing normal growth and steady educational progress. Continue routine follow-ups.';

  // Malnutrition prediction based on BMI and Nutrition Score
  if (bmi < 13.5 || nutritionScore < 50) {
    malnutritionPrediction = 'HIGH';
    riskScore += 35;
  } else if (bmi < 15 || nutritionScore < 70) {
    malnutritionPrediction = 'MEDIUM';
    riskScore += 15;
  }

  // Dropout prediction based on attendance
  if (attendance < 75) {
    dropoutPrediction = 'HIGH';
    riskScore += 35;
  } else if (attendance < 85) {
    dropoutPrediction = 'MEDIUM';
    riskScore += 15;
  }

  // Learning difficulty based on nutrition and attendance
  if (malnutritionPrediction === 'HIGH' || dropoutPrediction === 'HIGH') {
    learningDifficultyPrediction = 'HIGH';
    riskScore += 10;
  } else if (malnutritionPrediction === 'MEDIUM' || dropoutPrediction === 'MEDIUM') {
    learningDifficultyPrediction = 'MEDIUM';
    riskScore += 5;
  }

  riskScore = Math.min(Math.max(Math.round(riskScore), 5), 98);

  // Intervention logic
  if (riskScore >= 75) {
    priorityRanking = 1;
    if (malnutritionPrediction === 'HIGH' && dropoutPrediction === 'HIGH') {
      suggestedIntervention = 'EMERGENCY: Immediate deployment of nutrition supplements (RUTF peanut paste) and arrange an urgent counselor home visit to resolve chronic school absenteeism.';
      aiSummary = `Critical risk profile (${riskScore}%). ${child.name} is experiencing severe malnutrition indicators combined with high school dropout probability. Urgent dual-track intervention is required.`;
    } else if (malnutritionPrediction === 'HIGH') {
      suggestedIntervention = 'EMERGENCY HEALTH INTERVENTION: Deliver immediate caloric supplements and eggs/milk diet kits. Schedule weekly health checks with a volunteer.';
      aiSummary = `Critical health warning (${riskScore}%). Marked physical developmental delays detected. Diet intervention is key to preventing cognitive stunts.`;
    } else {
      suggestedIntervention = 'CRITICAL EDUCATION INTERVENTION: Initiate counselor contact with parent/guardian. Propose flexible study hours or localized support to curb family labor demands.';
      aiSummary = `Critical academic dropout risk (${riskScore}%). Severe class absenteeism (${attendance}%) is hindering primary learning milestones. Home counseling required.`;
    }
  } else if (riskScore >= 50) {
    priorityRanking = 2;
    suggestedIntervention = 'MODERATE INTERVENTION: Include child in daily protein supplement program (milk and nuts). Monitor attendance bi-weekly and assign a volunteer mentor.';
    aiSummary = `Elevated risk warning (${riskScore}%). Minor health deficiencies and attendance drops are beginning to affect the child's academic absorption.`;
  } else if (riskScore >= 30) {
    priorityRanking = 3;
    suggestedIntervention = 'PREVENTATIVE MEASURES: Provide standard stationery/book kits as school incentives. Encourage enrollment in extra-curricular sports or talent hubs.';
    aiSummary = `Mild risk level (${riskScore}%). Overall development is steady, but attendance could be stabilized with interactive school kits.`;
  } else {
    priorityRanking = 5;
    if (edu?.talentIdentification) {
      suggestedIntervention = `TALENT ACCELERATION: Nominate for specialized mentorship in ${edu.talentIdentification}. Provide books and advanced materials.`;
      aiSummary = `Excellent progress. Child demonstrates exceptional competency in ${edu.talentIdentification} with no health or academic warnings.`;
    }
  }

  return {
    riskScore,
    dropoutPrediction,
    malnutritionPrediction,
    learningDifficultyPrediction,
    talentIdentification: edu?.talentIdentification || 'N/A',
    suggestedIntervention,
    priorityRanking,
    aiSummary,
    date: new Date().toISOString()
  };
}

export const Repository = {
  // --- USERS ---
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { ngoProfile: true, donorProfile: true, volunteerProfile: true }
    });
  },

  // --- NGOS ---
  async getNGOs() {
    return await prisma.nGO.findMany({
      include: { children: true, donations: true }
    });
  },

  // --- CHILDREN ---
  async getChildren() {
    return await prisma.child.findMany({
      include: {
        ngo: true,
        healthRecords: { orderBy: { date: 'desc' } },
        educationRecords: { orderBy: { date: 'desc' } },
        aiReports: { orderBy: { date: 'desc' } }
      }
    });
  },

  async getChildById(id: string) {
    return await prisma.child.findUnique({
      where: { id },
      include: {
        ngo: true,
        healthRecords: { orderBy: { date: 'desc' } },
        educationRecords: { orderBy: { date: 'desc' } },
        aiReports: { orderBy: { date: 'desc' } }
      }
    });
  },

  async createChild(data: {
    name: string;
    age: number;
    gender: string;
    school: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianRelationship?: string;
    ngoId: string;
    height?: number;
    weight?: number;
    nutritionScore?: number;
    learningProgress?: string;
    attendanceRate?: number;
    talentIdentification?: string;
  }) {
    const heightVal = data.height ? Number(data.height) : 120;
    const weightVal = data.weight ? Number(data.weight) : 22;
    const nutritionScoreVal = data.nutritionScore ? Number(data.nutritionScore) : 75;
    const bmiVal = parseFloat((weightVal / Math.pow(heightVal / 100, 2)).toFixed(1));
    const learningProgressVal = data.learningProgress ?? 'Average';
    const attendanceVal = data.attendanceRate ? Number(data.attendanceRate) : 90;
    const talentVal = data.talentIdentification ?? 'None';

    const aiReportData = calculateAIPredictions(
      { name: data.name },
      { height: heightVal, weight: weightVal, nutritionScore: nutritionScoreVal },
      { attendanceRate: attendanceVal, talentIdentification: talentVal }
    );

    const createdChild = await prisma.child.create({
      data: {
        name: data.name,
        age: Number(data.age),
        gender: data.gender,
        school: data.school,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        guardianRelationship: data.guardianRelationship,
        ngoId: data.ngoId,
        healthRecords: {
          create: {
            height: heightVal,
            weight: weightVal,
            bmi: bmiVal,
            nutritionScore: nutritionScoreVal,
            healthReport: 'Initial profiling recorded.',
            riskAlerts: bmiVal < 14 ? 'Moderate risk of malnutrition (underweight).' : null
          }
        },
        educationRecords: {
          create: {
            learningProgress: learningProgressVal,
            attendanceRate: attendanceVal,
            learningDifficultyPrediction: attendanceVal < 80 ? 'Dropout vulnerability warning.' : null,
            talentIdentification: talentVal
          }
        },
        aiReports: {
          create: {
            riskScore: aiReportData.riskScore,
            dropoutPrediction: aiReportData.dropoutPrediction,
            malnutritionPrediction: aiReportData.malnutritionPrediction,
            learningDifficultyPrediction: aiReportData.learningDifficultyPrediction,
            talentIdentification: aiReportData.talentIdentification === 'N/A' ? null : aiReportData.talentIdentification,
            suggestedIntervention: aiReportData.suggestedIntervention,
            priorityRanking: aiReportData.priorityRanking,
            aiSummary: aiReportData.aiSummary
          }
        }
      }
    });

    if (aiReportData.priorityRanking <= 2) {
      await this.createNotification({
        userId: 'user_ngo',
        type: 'RISK_ALERT',
        title: `High Risk Alert: ${data.name}`,
        message: `${data.name} is classified as Priority ${aiReportData.priorityRanking} with a Risk Score of ${aiReportData.riskScore}%.`
      });
    }

    return createdChild;
  },

  async updateChild(id: string, data: {
    name?: string;
    age?: number;
    gender?: string;
    school?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianRelationship?: string;
    ngoId?: string;
    height?: number;
    weight?: number;
    nutritionScore?: number;
    learningProgress?: string;
    attendanceRate?: number;
    talentIdentification?: string;
  }) {
    const currentChild = await prisma.child.findUnique({
      where: { id },
      include: {
        healthRecords: { orderBy: { date: 'desc' }, take: 1 },
        educationRecords: { orderBy: { date: 'desc' }, take: 1 }
      }
    });

    if (!currentChild) throw new Error('Child not found');

    const latestHealth = currentChild.healthRecords[0];
    const latestEdu = currentChild.educationRecords[0];

    const updatedHeight = data.height !== undefined ? Number(data.height) : (latestHealth?.height ?? 120);
    const updatedWeight = data.weight !== undefined ? Number(data.weight) : (latestHealth?.weight ?? 22);
    const updatedNutrition = data.nutritionScore !== undefined ? Number(data.nutritionScore) : (latestHealth?.nutritionScore ?? 75);
    const updatedBmi = parseFloat((updatedWeight / Math.pow(updatedHeight / 100, 2)).toFixed(1));
    
    const updatedProgress = data.learningProgress ?? latestEdu?.learningProgress ?? 'Average';
    const updatedAttendance = data.attendanceRate !== undefined ? Number(data.attendanceRate) : (latestEdu?.attendanceRate ?? 90);
    const updatedTalent = data.talentIdentification ?? latestEdu?.talentIdentification ?? 'None';

    const hasHealthChanges = data.height !== undefined || data.weight !== undefined || data.nutritionScore !== undefined;
    const hasEduChanges = data.learningProgress !== undefined || data.attendanceRate !== undefined || data.talentIdentification !== undefined;

    const aiReportData = calculateAIPredictions(
      { name: data.name ?? currentChild.name },
      { height: updatedHeight, weight: updatedWeight, nutritionScore: updatedNutrition },
      { attendanceRate: updatedAttendance, talentIdentification: updatedTalent }
    );

    const updatedChild = await prisma.child.update({
      where: { id },
      data: {
        name: data.name,
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender,
        school: data.school,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        guardianRelationship: data.guardianRelationship,
        ngoId: data.ngoId,
        healthRecords: hasHealthChanges ? {
          create: {
            height: updatedHeight,
            weight: updatedWeight,
            bmi: updatedBmi,
            nutritionScore: updatedNutrition,
            healthReport: 'Updated via volunteer health audit.',
            riskAlerts: updatedBmi < 14 ? 'Moderate risk of malnutrition (underweight).' : null
          }
        } : undefined,
        educationRecords: hasEduChanges ? {
          create: {
            learningProgress: updatedProgress,
            attendanceRate: updatedAttendance,
            learningDifficultyPrediction: updatedAttendance < 80 ? 'Dropout vulnerability warning.' : null,
            talentIdentification: updatedTalent
          }
        } : undefined,
        aiReports: {
          create: {
            riskScore: aiReportData.riskScore,
            dropoutPrediction: aiReportData.dropoutPrediction,
            malnutritionPrediction: aiReportData.malnutritionPrediction,
            learningDifficultyPrediction: aiReportData.learningDifficultyPrediction,
            talentIdentification: aiReportData.talentIdentification === 'N/A' ? null : aiReportData.talentIdentification,
            suggestedIntervention: aiReportData.suggestedIntervention,
            priorityRanking: aiReportData.priorityRanking,
            aiSummary: aiReportData.aiSummary
          }
        }
      }
    });

    if (aiReportData.priorityRanking <= 2) {
      await this.createNotification({
        userId: 'user_ngo',
        type: 'RISK_ALERT',
        title: `Risk Alert Update: ${updatedChild.name}`,
        message: `${updatedChild.name} risk index is now ${aiReportData.riskScore}% (Priority ${aiReportData.priorityRanking}).`
      });
    }

    return updatedChild;
  },

  async deleteChild(id: string) {
    await prisma.child.delete({ where: { id } });
    return true;
  },

  // --- DONATIONS ---
  async getDonations() {
    return await prisma.donation.findMany({
      include: { donor: true, ngo: true, child: true },
      orderBy: { date: 'desc' }
    });
  },

  async createDonation(data: {
    amount: number;
    usage: string;
    donorId: string;
    ngoId: string;
    childId?: string;
  }) {
    const donation = await prisma.donation.create({
      data: {
        amount: Number(data.amount),
        usage: data.usage,
        donorId: data.donorId,
        ngoId: data.ngoId,
        childId: data.childId
      }
    });

    // Update donor aggregate total
    await prisma.donor.update({
      where: { id: data.donorId },
      data: { totalDonated: { increment: Number(data.amount) } }
    });

    const donorUser = await prisma.donor.findUnique({
      where: { id: data.donorId },
      include: { user: true }
    });

    await this.createNotification({
      userId: 'user_ngo',
      type: 'DONATION_CONFIRMATION',
      title: 'Donation Received',
      message: `Donor ${donorUser?.name || 'Anonymous'} has donated $${data.amount} for ${data.usage}.`
    });

    const total = (donorUser?.totalDonated ?? 0);
    if (total >= 500 && donorUser?.userId) {
      await this.createNotification({
        userId: donorUser.userId,
        type: 'ACHIEVEMENT_BADGE',
        title: 'Badge Unlocked: Nutrition Champion',
        message: 'You have donated over $500 total in medical & nutritional relief!'
      });
    }

    return donation;
  },

  // --- VOLUNTEERS & TASKS ---
  async getVolunteers() {
    return await prisma.volunteer.findMany();
  },

  async getTasks() {
    return await prisma.task.findMany({
      orderBy: { dueDate: 'asc' }
    });
  },

  async updateTask(id: string, data: { status: string }) {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: data.status }
    });

    if (data.status === 'COMPLETED') {
      await this.createNotification({
        userId: 'user_ngo',
        type: 'VOLUNTEER_REMINDER',
        title: 'Task Completed',
        message: `Volunteer Sarah Jenkins completed the task: "${updatedTask.title}"`
      });
    }

    return updatedTask;
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: {
        OR: [
          { userId },
          { userId: 'user_ngo' } // NGO admin notification fallback
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createNotification(data: { userId: string; type: string; title: string; message: string }) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message
      }
    });
  },

  async markNotificationRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { status: 'READ' }
    });
  },

  // --- ANALYTICS ---
  async getAnalytics() {
    const children = await this.getChildren();
    const donations = await this.getDonations();
    const ngos = await this.getNGOs();
    const volunteers = await this.getVolunteers();

    const totalChildren = children.length;
    const totalNGOs = ngos.length;
    const totalVolunteers = volunteers.length;
    const totalDonated = donations.reduce((sum: number, d: any) => sum + d.amount, 0);

    let sumNutrition = 0;
    let sumAttendance = 0;
    let childrenWithScores = 0;
    let childrenWithAttendance = 0;
    let activeAlerts = 0;

    children.forEach((c: any) => {
      const hr = c.healthRecords[0];
      const er = c.educationRecords[0];
      const ai = c.aiReports[0];

      if (hr) {
        sumNutrition += hr.nutritionScore;
        childrenWithScores++;
      }
      if (er) {
        sumAttendance += er.attendanceRate;
        childrenWithAttendance++;
      }
      if (ai && ai.priorityRanking <= 2) {
        activeAlerts++;
      }
    });

    const avgNutrition = childrenWithScores > 0 ? Math.round(sumNutrition / childrenWithScores) : 75;
    const avgAttendance = childrenWithAttendance > 0 ? parseFloat((sumAttendance / childrenWithAttendance).toFixed(1)) : 88.5;

    const monthlyDonations = [
      { month: 'Jan', donations: 2400, children: 6 },
      { month: 'Feb', donations: 3100, children: 8 },
      { month: 'Mar', donations: 4200, children: 10 },
      { month: 'Apr', donations: 3800, children: 10 },
      { month: 'May', donations: 5400, children: 10 },
      { month: 'Jun', donations: totalDonated || 15250, children: totalChildren || 3 }
    ];

    let p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0;
    children.forEach((c: any) => {
      const ai = c.aiReports[0];
      if (ai) {
        if (ai.priorityRanking === 1) p1++;
        if (ai.priorityRanking === 2) p2++;
        if (ai.priorityRanking === 3) p3++;
        if (ai.priorityRanking === 4) p4++;
        if (ai.priorityRanking === 5) p5++;
      }
    });

    return {
      stats: {
        totalChildren,
        totalNGOs,
        totalVolunteers,
        activeDonations: donations.length,
        totalDonated,
        nutritionScore: avgNutrition,
        educationProgress: avgAttendance,
        healthRiskAlerts: activeAlerts
      },
      predictions: {
        priorityDistribution: { p1, p2, p3, p4, p5 },
        dropoutRiskCount: children.filter((c: any) => c.aiReports[0]?.dropoutPrediction === 'HIGH').length,
        malnutritionRiskCount: children.filter((c: any) => c.aiReports[0]?.malnutritionPrediction === 'HIGH').length,
        learningDiffCount: children.filter((c: any) => c.aiReports[0]?.learningDifficultyPrediction === 'HIGH').length
      },
      charts: {
        monthlyDonations,
        nutritionScatter: children.map((c: any) => ({
          name: c.name,
          nutrition: c.healthRecords[0]?.nutritionScore ?? 50,
          attendance: c.educationRecords[0]?.attendanceRate ?? 50,
          risk: c.aiReports[0]?.riskScore ?? 20
        }))
      }
    };
  }
};
