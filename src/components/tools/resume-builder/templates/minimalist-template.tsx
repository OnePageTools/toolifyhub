
"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '@/lib/schema/resume-schema';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ],
});

type ColorTheme = {
    primary: string;
    text: string;
    secondary: string;
};

const createStyles = (theme: ColorTheme) => StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 40,
    color: theme.text,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: `2px solid ${theme.primary}`,
    paddingBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    fontSize: 9,
  },
  contactItem: {
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subheading: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    backgroundColor: theme.primary,
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 9,
  }
});

interface TemplateProps {
  data: ResumeData;
  theme: ColorTheme;
}


export const MinimalistTemplate = ({ data, theme }: TemplateProps) => {
    const styles = createStyles(theme);
    return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.name}>{data.fullName}</Text>
            <View style={styles.contactInfo}>
                <Text style={styles.contactItem}>{data.email}</Text>
                <Text style={styles.contactItem}> | </Text>
                <Text style={styles.contactItem}>{data.phone}</Text>
                 <Text style={styles.contactItem}> | </Text>
                <Text style={styles.contactItem}>{data.address}</Text>
                 {data.linkedin && <><Text style={styles.contactItem}> | </Text><Link style={styles.contactItem} src={data.linkedin}>LinkedIn</Link></>}
            </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.text}>{data.summary}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
                {data.skills?.map((skill, index) => (
                    <Text key={index} style={styles.skill}>{skill}</Text>
                ))}
            </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience?.map((exp, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.subheading}>{exp.jobTitle} at {exp.company}</Text>
                    <Text style={{fontSize: 9}}>{exp.startDate} - {exp.endDate}</Text>
                </View>
              {exp.responsibilities?.map((resp, i) => (
                <Text key={i} style={styles.listItem}>• {resp}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education?.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.subheading}>{edu.degree} - {edu.school}</Text>
                <Text style={{fontSize: 9}}>{edu.gradDate}</Text>
              </View>
            </View>
          ))}
        </View>

         {data.projects && data.projects.length > 0 && data.projects[0]?.name && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((proj, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.subheading}>{proj.name}</Text>
                  <Text style={styles.text}>{proj.description}</Text>
                </View>
              ))}
            </View>
          )}

      </Page>
    </Document>
  )
};
